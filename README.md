# teamX Hackathon Project  
## Automatic Attendance System (Location-based)

---

### 🔹 1. The Core Idea (One-liner)

**“Attendance is automatically marked when both teacher and student are detected within the same classroom location during class time.”**

---

### 🔹 2. Flow (Step-by-step)

1. **Login:**  
   Teacher/Student/Admin login.

2. **Teacher starts session:**  
   A class session begins.

3. **Student location check:**  
   The system tracks student’s GPS/WiFi location for 15 minutes.  
   - If student is within 10m of teacher → marked **Present**.  
   - If student outside range → marked **Absent**.  
   - If technical issue (GPS off, signal low, spoofing suspected) → shown as “⚠️ Pending” → teacher decides manually.

4. **Automatic shut-off:**  
   Location tracking stops after 15 minutes → saving battery & privacy.

5. **Dashboard view:**  
   Students see their attendance record in real time.  
   Teachers see who’s present/absent.

---

### 🔹 3. Why it Works (Benefits)

- **Removes manual roll calls:** Saves class time.
- **Harder to cheat:** Location spoofing restricted, developer mode warning.
- **Handles real-life issues:** Weak signal, GPS errors → flagged instead of auto-absent.
- **Privacy preserved:** Tracking only 15 min, not entire class.

---

### 🔹 4. What’s Unique (Your Innovation)

- **Location window approach:** Instead of checking only once (at QR scan), system checks for a short duration → more accurate.
- **Developer Mode Detection:** Warns if students try to fake GPS.
- **Teacher Control:** Teacher can set location window (1, 5, 10, 15 min).
- **Future Gamification:** AI tasks & “Trust Coins” → improve engagement and let students earn attendance flexibility.

---

### 🔹 5. Simple Analogy

**“Think of it like a digital gatekeeper:  
If you walk into the classroom (near teacher), the system recognizes you’re really there.  
If you try to cheat from outside, it won’t let you in.  
If the system is unsure, it asks the teacher to decide.”**

---

👉 *This is the pitch-style summary.*
