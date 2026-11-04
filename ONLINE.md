# Central online rooms

The GitHub Pages client uses HTTPS JSON APIs at https://yongvit-xo-room-service.yongvits.chatgpt.site . This removes the dependency on peer-to-peer WebRTC and does not require STUN, TURN, or same-Wi-Fi access.

Server project: appgprj_6aeaa4a521d081918abc71d28388e271

Public service access was approved by the owner on 2026-11-04 and is enabled. The GitHub Pages client connects anonymously to the room roster; seat-specific game actions require a per-player token. No service bypass credentials belong in this repository or client code.

API: GET /v1/rooms?game=xo|checkers, POST /v1/join, /v1/poll, /v1/action, /v1/leave. Public rosters expose nicknames, sides and occupancy only. Room actions and full game state require an unguessable per-tab bearer token, stored as a hash on the server. The server validates every move. Atomic R2 conditional writes prevent double seating and stale actions. Requests are CORS restricted to https://yongvits.github.io.

v10 uses adaptive HTTPS polling, not WebSockets. The supported Sites manifest provisions R2/D1 but does not provide a Durable Objects binding for cross-isolate WebSocket room coordination. Rooms refresh every 2 seconds. Game polls start approximately every 400 ms while waiting for the opponent's turn (network permitting), every 2 seconds during your turn, and every 1.8 seconds while waiting for a player or after a result. Requests never overlap within a session, pause in hidden tabs, and back off to 8 seconds on errors. Returning to the tab or regaining connectivity triggers immediate synchronization. This increases request usage during active online play compared with v9; it is not a guarantee of 400 ms end-to-end latency.

Legal XO and Thai checkers moves render locally before the server reply; further inputs are locked until confirmation. The original revision/epoch is sent to the authoritative server. Rejections roll back the preview and reload the board; late poll responses cannot overwrite an in-flight move. No automatic replay of uncertain actions occurs.

Polls renew their presence lease every 8 seconds; disconnected players disappear within 45 seconds. Leaving explicitly releases the seat. New membership resets the board to prevent replacing a player mid-game. Network errors disable moves after 10 seconds and retry. Online names default to distinct player labels when no nickname is entered. Local computer play remains available.

Validated: atomic capacity under concurrent joins; names and privacy of roster; wrong-turn/stale/concurrent move rejection; token-specific leave; room replacement; lease expiry; two integrated clients with actual rules; deployed private service with two HTTP clients and synchronized move. v10 client integration tests additionally cover optimistic XO/checkers movement, stale in-flight polls, server rejection rollback, and adaptive cadence/backoff.
