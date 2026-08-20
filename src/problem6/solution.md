## Prompt

_Read the requirements in `task.md` and my design instructions here to address all defined requirements (`task.md`). Below is my specifications and flow directions_

Note: this file is a guidance designated for an LLM Agent to read and perform its work. And it will fulfill all requirements here as intended of the author (me).

## Specification Direction

- We need to define user request for increasing score, each user has a unique ID
- How does score affect scoring mechanism? How to know a specific user score?
- Message to show when user fail to authorize, fail to match requirements and server is temporarily unavailable
- What is the max score and min score?
- How often does the score update (at max 1 second)
- The score is only used to display in leaderboard, it does not affect any other functionality

## Flow Direction

Assume that this platform serve **millions of users** update score at the same time. We need to prevent user **malicious modify score** or **update score without authorization**.

1. User do something (an action - intend to increase score) -> use **load balancing** and **rate limit** to control request number, prevent **DOS attack** and **request spamming** -> client authentication, token validation and **request idempotency** (avoid spam or duplicate request)
2. Invoke update score service to **verify client's data**
3. If request **fails to match all above requirements**, return error message to client and go to step 7. Else, we **perform step 4** and **return success message** to client (asynchronous)
4. **Queue (RabbitMQ)** - queue all success requests for high availability and data persistence. If queue is full or unavailable, we reject the request and return error message to client (this is best for user experience). Else, we process queue on a **First In First Out** basis and send to step 5 (This is best for fairness)
   > **Note**: if our system can scale on demands by cloud services we don't need to reject or throw error when queue is full or unavailable because we can have more queue to serve traffic surge.
5. **Process (worker)** - do some computing work if have and then **update score in database**
6. **Real-time broadcast (WebSocket)** - broadcast score update to client
7. **Complete** (whether update fail or success).

## Document Feedback

- Should describe the **traffic volume** based on average and special event to avoid incidents (the above proposed solution just for **medium to large capacity** need, if the platform serve **small scale users**, we can use **simpler architecture** like just **single node** and no queue or message broker and can rely on **on-premise** system only)
- Should describe the **latency tolerance** for real-time update feature. Is it acceptable if the score is updated in 1-2 seconds => this is to ensure system capacity can meet the requirements and can have high availability
- Should describe the **security requirements** in detail (password, encryption, token, time-hashing, etc.) to avoid security incidents.
- Should describe **what happen** or add a small note to clarify a situation when user fail to match requirement in each step
