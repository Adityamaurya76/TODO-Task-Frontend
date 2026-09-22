const API_BASE_URL = 'http://localhost:5000/api/v1/todos';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(API_BASE_URL);
  const data = await res.json();
  return data.data || [];
};

export const createTodo = async (title: string, description: string): Promise<Todo> => {
  const res = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  const data = await res.json();
  return data.data;
};

export const updateTodo = async (
  id: string,
  fields: { title?: string; description?: string; completed?: boolean }
): Promise<Todo> => {
  const res = await fetch(`${API_BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  return data.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/delete/${id}`, {
    method: 'DELETE',
  });
};
