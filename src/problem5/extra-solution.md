## Improvements

- Use linting and formatting tool to avoid convention violation
- Update test case with Jest and other testing tools to integrate unit tests, also add guideline, script or agent skills to perform integration test, end-to-end test
- Setup CI/CD and deployment to cloud environment (Vercel, AWS, etc.)
- Setup monitoring and logging

## Extra Architecture Solution (Sledgehammer to crack a nut)

- Microservice architecture with two simple services for class and student (can have more services like teacher and subject)
- Use Nginx as the Reverse Proxy and load balancer - School portal to transit data in and out all services
- Dockerize all services with their own database, message queue endpoints
- We can have 2 node for student services with load balancer to handle high traffic and other services (db server nodes, message queue node, portal node) use single node, this architecture is flexible and scalable
- We can use message queue to communicate between services for high availability and fault tolerance and also help de-couple services (RabbitMQ or Kafka, but I just know RabbitMQ)
- We can use Redis for caching to reduce database load and improve performance for read operations between services
- Finally, we orchestrate all of these nodes by docker-compose for easy deployment and management
