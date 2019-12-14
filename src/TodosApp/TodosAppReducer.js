import useMethods from "use-methods"

const initialState = {
	todo: "", // Current todo (new todo).
	todos: [] // Current todos.
}

const reducer = state => ({
	setState(todos) {
		state.todos = todos
	},
	setTodo(todo) {
		state.todo = todo
	},
	addTodo(id, todo) {
		state.todo = ""
		state.todos.unshift({ id, todo })
	},
	removeTodo(id) {
		const index = state.todos.findIndex(todo => todo.id === id)
		state.todos.splice(index, 1)
	}
})

const useTodosAppReducer = () => useMethods(reducer, initialState)

export default useTodosAppReducer
