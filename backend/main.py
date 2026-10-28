import time
import uuid
import random
import string
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="VoteForMP - Game Voting Backend",
    description="Backend API for multiplayer game polling session",
    version="1.0.0",
)

# Enable CORS for any origin so GitHub Pages can easily interact with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class CreateRoomRequest(BaseModel):
    host_name: str = Field(..., min_length=1, max_length=50)
    client_id: str = Field(..., min_length=1)

class JoinRoomRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    client_id: str = Field(..., min_length=1)

class AddGamesRequest(BaseModel):
    client_id: str
    games: List[str] = Field(..., min_items=1)

class DeleteGameRequest(BaseModel):
    client_id: str

class StartVoteRequest(BaseModel):
    client_id: str

class SubmitVoteRequest(BaseModel):
    client_id: str
    # Map of game_id -> rating (1 to 5)
    votes: Dict[str, int]

class FinishVoteRequest(BaseModel):
    client_id: str

class ResetRoundRequest(BaseModel):
    client_id: str
    keep_games: bool = True

# --- In-Memory Storage ---
# For a production setup this could be SQLite/Postgres/Redis,
# but in-memory with automatic cleanup is fast, reliable, and zero-dependency.

rooms: Dict[str, Dict[str, Any]] = {}

def generate_room_code() -> str:
    letters = "".join(random.choices(string.ascii_uppercase, k=4))
    digits = "".join(random.choices(string.digits, k=2))
    return f"{letters}{digits}"

# Розумні ваги для голосування:
# 1 голос -2 має вагу -4 бали, що врівноважує 2 голоси +2 (+2 і +2 = +4)
# 1 голос -1 має вагу -2 бали
# 0 залишається 0
# +1 додає 1 бал
# +2 додає 2 бали
SMART_WEIGHTS = {
    -2: -4,
    -1: -2,
     0:  0,
     1:  1,
     2:  2
}

def normalize_rating(val: int) -> Optional[int]:
    """Normalizes rating to -2, -1, 0, +1, +2 scale."""
    if -2 <= val <= 2:
        return val
    if 1 <= val <= 5:
        # Legacy fallback: map 1 -> -2, 2 -> -1, 3 -> 0, 4 -> +1, 5 -> +2
        return val - 3
    return None

def calculate_room_results(room: Dict[str, Any]) -> Dict[str, Any]:
    games = room.get("games", [])
    votes_by_participant = room.get("votes", {})
    
    if not games:
        return {"winners": [], "leaderboard": [], "total_voters": len(votes_by_participant)}
    
    leaderboard = []
    
    for game in games:
        gid = game["id"]
        ratings = []
        breakdown = {-2: 0, -1: 0, 0: 0, 1: 0, 2: 0}
        voter_tags = []
        
        for participant_id, user_votes in votes_by_participant.items():
            if gid in user_votes:
                try:
                    r = int(user_votes[gid])
                    norm_r = normalize_rating(r)
                    if norm_r is not None:
                        ratings.append(norm_r)
                        breakdown[norm_r] += 1
                        p_name = room.get("participants", {}).get(participant_id, {}).get("name", "Гравець")
                        voter_tags.append({
                            "user_id": participant_id,
                            "name": p_name,
                            "rating": norm_r,
                            "formatted_rating": f"+{norm_r}" if norm_r > 0 else str(norm_r)
                        })
                except (ValueError, TypeError):
                    pass
        
        # Сортуємо теги оцінок: спочатку найвищі оцінки
        voter_tags.sort(key=lambda vt: (vt["rating"], vt["name"]), reverse=True)
        
        vote_count = len(ratings)
        # Розумний сумарний бал (без середнього арифметичного):
        score = sum(SMART_WEIGHTS.get(r, r) for r in ratings)
        formatted_score = f"+{score}" if score > 0 else str(score)
        
        leaderboard.append({
            "id": gid,
            "title": game["title"],
            "added_by": game.get("added_by", "Невідомо"),
            "vote_count": vote_count,
            "score": score,
            "total_score": score,
            "formatted_score": formatted_score,
            "formatted_total": formatted_score,
            "breakdown": breakdown,
            "voter_tags": voter_tags,
            "is_winner": False
        })
    
    # Сортування таблиці: найбільший розумний бал спочатку, потім кількість голосів
    leaderboard.sort(key=lambda x: (x["score"], x["vote_count"]), reverse=True)
    
    # Визначення переможця / переможців за розумним балом
    winners = []
    if leaderboard and leaderboard[0]["vote_count"] > 0:
        top_score = leaderboard[0]["score"]
        # Якщо однакова найвища оцінка — показуємо всіх переможців (нічия)
        for item in leaderboard:
            if item["score"] == top_score:
                item["is_winner"] = True
                winners.append(item)
            else:
                break
                
    return {
        "winners": winners,
        "is_tie": len(winners) > 1,
        "leaderboard": leaderboard,
        "total_voters": len(votes_by_participant)
    }

def check_and_finalize_if_all_voted(room: Dict[str, Any]):
    """If all participants voted, transition room to results automatically."""
    participants = room.get("participants", {})
    votes = room.get("votes", {})
    
    if not participants:
        return
    
    # Check if every participant in the room has submitted votes
    all_voted = all(p_id in votes for p_id in participants.keys())
    if all_voted and room.get("status") == "voting":
        room["status"] = "results"
        room["results"] = calculate_room_results(room)
        room["updated_at"] = time.time()

# --- Routes ---

@app.get("/")
def root():
    return {
        "message": "VoteForMP Backend API is running!",
        "status": "healthy",
        "endpoints": {
            "health": "/health",
            "api_health": "/api/health"
        }
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "timestamp": time.time(),
        "active_rooms": len(rooms)
    }

@app.post("/api/rooms")
def create_room(req: CreateRoomRequest):
    room_id = generate_room_code()
    while room_id in rooms:
        room_id = generate_room_code()
    
    host_participant = {
        "id": req.client_id,
        "name": req.host_name,
        "is_host": True,
        "joined_at": time.time(),
        "last_active": time.time()
    }
    
    rooms[room_id] = {
        "id": room_id,
        "host_id": req.client_id,
        "host_name": req.host_name,
        "status": "lobby",  # 'lobby', 'voting', 'results'
        "participants": {req.client_id: host_participant},
        "games": [],
        "votes": {},  # participant_id -> {game_id: rating}
        "results": None,
        "created_at": time.time(),
        "updated_at": time.time()
    }
    
    return {
        "room_id": room_id,
        "room": sanitize_room_data(rooms[room_id], req.client_id)
    }

@app.get("/api/rooms/{room_id}")
def get_room(room_id: str, client_id: Optional[str] = None):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено! Перевірте код кімнати.")
    
    room = rooms[room_id]
    
    if client_id and client_id in room["participants"]:
        room["participants"][client_id]["last_active"] = time.time()
        
    return {"room": sanitize_room_data(room, client_id)}

@app.post("/api/rooms/{room_id}/join")
def join_room(room_id: str, req: JoinRoomRequest):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено! Перевірте код кімнати.")
    
    room = rooms[room_id]
    
    # Update or add participant
    is_host = (req.client_id == room["host_id"])
    room["participants"][req.client_id] = {
        "id": req.client_id,
        "name": req.name,
        "is_host": is_host,
        "joined_at": time.time(),
        "last_active": time.time()
    }
    room["updated_at"] = time.time()
    
    # In case voting was underway and all others voted
    check_and_finalize_if_all_voted(room)
    
    return {"room": sanitize_room_data(room, req.client_id)}

@app.post("/api/rooms/{room_id}/games")
def add_games(room_id: str, req: AddGamesRequest):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено.")
    
    room = rooms[room_id]
    if room["status"] != "lobby":
        raise HTTPException(status_code=400, detail="Гри можна додавати тільки на етапі лобі!")
    
    participant = room["participants"].get(req.client_id)
    adder_name = participant["name"] if participant else "Гість"
    
    existing_titles = {g["title"].lower().strip() for g in room["games"]}
    added_count = 0
    
    for title in req.games:
        clean_title = title.strip()
        if clean_title and clean_title.lower() not in existing_titles:
            room["games"].append({
                "id": str(uuid.uuid4())[:8],
                "title": clean_title,
                "added_by": adder_name,
                "added_by_id": req.client_id,
                "created_at": time.time()
            })
            existing_titles.add(clean_title.lower())
            added_count += 1
            
    room["updated_at"] = time.time()
    return {
        "message": f"Додано ігор: {added_count}",
        "room": sanitize_room_data(room, req.client_id)
    }

@app.delete("/api/rooms/{room_id}/games/{game_id}")
def delete_game(room_id: str, game_id: str, client_id: str):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено.")
    
    room = rooms[room_id]
    if room["status"] != "lobby":
        raise HTTPException(status_code=400, detail="Видаляти гру можна тільки до початку голосування.")
    
    # Check permission: Host or creator of the game
    is_host = (client_id == room["host_id"])
    initial_len = len(room["games"])
    room["games"] = [
        g for g in room["games"]
        if g["id"] != game_id or (not is_host and g.get("added_by_id") != client_id)
    ]
    
    if len(room["games"]) == initial_len:
        raise HTTPException(status_code=403, detail="Немає прав для видалення цієї гри або гру не знайдено.")
        
    room["updated_at"] = time.time()
    return {"message": "Гру видалено", "room": sanitize_room_data(room, client_id)}

@app.post("/api/rooms/{room_id}/start-vote")
def start_vote(room_id: str, req: StartVoteRequest):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено.")
    
    room = rooms[room_id]
    if req.client_id != room["host_id"]:
        raise HTTPException(status_code=403, detail="Лише хост кімнати може розпочати голосування!")
    
    if len(room["games"]) < 1:
        raise HTTPException(status_code=400, detail="Додайте хоча б одну гру для голосування!")
        
    room["status"] = "voting"
    room["votes"] = {}
    room["results"] = None
    room["updated_at"] = time.time()
    
    return {"message": "Голосування розпочато!", "room": sanitize_room_data(room, req.client_id)}

@app.post("/api/rooms/{room_id}/vote")
def submit_vote(room_id: str, req: SubmitVoteRequest):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено.")
    
    room = rooms[room_id]
    if room["status"] != "voting":
        raise HTTPException(status_code=400, detail="Голосування наразі не активне!")
        
    if req.client_id not in room["participants"]:
        raise HTTPException(status_code=403, detail="Ви не є зареєстрованим учасником цієї кімнати.")
    
    valid_game_ids = {g["id"] for g in room["games"]}
    cleaned_votes = {}
    
    for gid, rating in req.votes.items():
        if gid in valid_game_ids:
            try:
                r = int(rating)
                norm_r = normalize_rating(r)
                if norm_r is not None:
                    cleaned_votes[gid] = norm_r
            except (ValueError, TypeError):
                pass
                
    if not cleaned_votes:
        raise HTTPException(status_code=400, detail="Будь ласка, поставте оцінки хоча б одній грі.")
        
    room["votes"][req.client_id] = cleaned_votes
    room["updated_at"] = time.time()
    
    # Auto-check if all participants voted
    check_and_finalize_if_all_voted(room)
    
    return {
        "message": "Голос успішно зараховано!",
        "room": sanitize_room_data(room, req.client_id)
    }

@app.post("/api/rooms/{room_id}/finish-vote")
def force_finish_vote(room_id: str, req: FinishVoteRequest):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено.")
    
    room = rooms[room_id]
    if req.client_id != room["host_id"]:
        raise HTTPException(status_code=403, detail="Лише хост кімнати може достроково завершити голосування!")
    
    room["status"] = "results"
    room["results"] = calculate_room_results(room)
    room["updated_at"] = time.time()
    
    return {
        "message": "Голосування завершено!",
        "room": sanitize_room_data(room, req.client_id)
    }

@app.post("/api/rooms/{room_id}/reset")
def reset_round(room_id: str, req: ResetRoundRequest):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено.")
    
    room = rooms[room_id]
    if req.client_id != room["host_id"]:
        raise HTTPException(status_code=403, detail="Лише хост кімнати може перезапустити сесію!")
        
    room["status"] = "lobby"
    room["votes"] = {}
    room["results"] = None
    if not req.keep_games:
        room["games"] = []
    room["updated_at"] = time.time()
    
    return {
        "message": "Сесію скинуто до лобі!",
        "room": sanitize_room_data(room, req.client_id)
    }

@app.delete("/api/rooms/{room_id}/participants/{participant_id}")
def kick_or_leave(room_id: str, participant_id: str, client_id: str):
    room_id = room_id.upper()
    if room_id not in rooms:
        raise HTTPException(status_code=404, detail="Кімнату не знайдено.")
        
    room = rooms[room_id]
    is_host = (client_id == room["host_id"])
    is_self = (client_id == participant_id)
    
    if not (is_host or is_self):
        raise HTTPException(status_code=403, detail="Немає прав для видалення цього учасника.")
        
    if participant_id in room["participants"]:
        del room["participants"][participant_id]
    if participant_id in room["votes"]:
        del room["votes"][participant_id]
        
    room["updated_at"] = time.time()
    check_and_finalize_if_all_voted(room)
    
    return {"message": "Учасника видалено", "room": sanitize_room_data(room, client_id)}

def sanitize_room_data(room: Dict[str, Any], viewer_client_id: Optional[str]) -> Dict[str, Any]:
    """Prepares safe payload for clients, including voting status."""
    participants_list = []
    for pid, pdata in room["participants"].items():
        participants_list.append({
            "id": pid,
            "name": pdata["name"],
            "is_host": pdata.get("is_host", False),
            "has_voted": pid in room.get("votes", {}),
            "is_you": (pid == viewer_client_id)
        })
    
    # Calculate user's own votes if in voting stage
    user_votes = {}
    if viewer_client_id and viewer_client_id in room.get("votes", {}):
        user_votes = room["votes"][viewer_client_id]
        
    # If room is finished, calculate results if not already present
    results = room.get("results")
    if room["status"] == "results" and not results:
        results = calculate_room_results(room)
        room["results"] = results
        
    return {
        "id": room["id"],
        "status": room["status"],
        "host_id": room["host_id"],
        "host_name": room["host_name"],
        "is_viewer_host": (viewer_client_id == room["host_id"]),
        "participants": participants_list,
        "total_participants": len(participants_list),
        "voted_count": len(room.get("votes", {})),
        "games": room.get("games", []),
        "user_has_voted": viewer_client_id in room.get("votes", {}),
        "user_votes": user_votes,
        "results": results,
        "updated_at": room.get("updated_at")
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting VoteForMP backend server on http://0.0.0.0:8000 ...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

