const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointUrl = '/todos/';

let firstTodo, newTodoId;
const testData = {
    title: 'Make integration test for todo',
    done: true
};
const notExistingTodoId = '62b3f5f2e1f3f531a0c6b123';

describe(endpointUrl, () => {
    it("POST" + endpointUrl, async () => {
        const response = await request(app)
        .post (endpointUrl)
        .send(newTodo)
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        newTodoId = response.body._id;
    });
    it('should return 500 if info is missing', async () => {
        const response = await request(app)
        .post (endpointUrl)
        .send({ title: 'Missing done property' });
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({ message: "Todo validation failed: done: Path `done` is required." });
    });
    it("GET " + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    });
    it("GET " + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + firstTodo._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });
    it("GET todoById doesnt exist" + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + '62b3f5f2e1f3f531a0c6b123');
        expect(response.statusCode).toBe(404);
    });
    it("PUT " + endpointUrl, async () => {
        const response = await request(app)
        .put (endpointUrl + newTodoId)
        .send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    it("PUT todoId doesnt exist " + endpointUrl, async () => {
        const response = await request(app)
        .put (endpointUrl + notExistingTodoId)
        .send(testData);
        expect(response.statusCode).toBe(404);
    });

        it("DELETE " + endpointUrl, async () => {
        const response = await request(app)
        .delete (endpointUrl + newTodoId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(newTodoId);
    });
    it("DELETE todoId doesnt exist " + endpointUrl, async () => {
        const response = await request(app)
        .delete (endpointUrl + notExistingTodoId);
        expect(response.statusCode).toBe(404);
    });
});