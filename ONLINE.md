# Central online rooms

The GitHub Pages client uses HTTPS JSON APIs at https://yongvit-xo-room-service.yongvits.chatgpt.site . This removes the dependency on peer-to-peer WebRTC and does not require STUN, TURN, or same-Wi-Fi access.

Server project: appgprj_6aeaa4a521d081918abc71d28388e271

The service is deployed owner-private until public access is approved. Do not merge this client branch while the service is private; GitHub Pages visitors cannot authenticate to the private API. No service bypass credentials belong in this repository or client code.

API: GET /v1/rooms?game=xo|checkers, POST /v1/join, /v1/poll, /v1/action, /v1/leave. Public rosters expose nicknames, sides and occupancy only. Room actions and full game state require an unguessable per-tab bearer token, stored as a hash on the server. The server validates every move. Atomic R2 conditional writes prevent double seating and stale actions. Requests are CORS restricted to https://yongvits.github.io.

Rooms update every 4 seconds. Games poll every 1.5 seconds, renewing their presence lease every 8 seconds; disconnected players disappear within 45 seconds. Leaving explicitly releases the seat. New membership resets the board to prevent replacing a player mid-game. Network errors disable moves after 10 seconds and retry. Online names default to distinct player labels when no nickname is entered. Local computer play remains available.

Validated: atomic capacity under concurrent joins; names and privacy of roster; wrong-turn/stale/concurrent move rejection; token-specific leave; room replacement; lease expiry; two integrated clients with actual rules; deployed private service with two HTTP clients and synchronized move.
