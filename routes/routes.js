import { db } from '../db/db.js';
import { createTodoSchema } from './validation.js';

// map from snake case to camelcase
function mapTodoRow(row) {
  return {
    id: row.id,
    state: row.state,
    description: row.description,
    createdAt: row.created_at,
    completedAt: row.completed_at
  };
}


export function setupRoutes(server) {
  // GET (test) - /
  server.route({
    method: "GET",
    path: "/",
    handler: (request, response) => {
      return "Hello World!";
    },
  });

  // POST -- /todos
  // Add new item to todo list
  // JSON with list item (body and INCOMPLETE)
  server.route({
    method: 'POST',
    path: '/todos',
    options: {
      validate: {
        payload: createTodoSchema,
        failAction: (request, h, err) => 
          h
          .response ({error: 'Invalid Payload', details: err.details})
          .code(400)
          .takeover()
      }
    },
    handler: async (request, h) => {
      const {description} = request.payload;

      const [inserted] = await db('todos')
        .insert({
          description, 
          state: 'INCOMPLETE'
        })
        .returning(['id', 'state', 'description', 'created_at', 'completed_at']);
      return h.response(mapTodoRow(inserted)).code(201);
    }
  });


}