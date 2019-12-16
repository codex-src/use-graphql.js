import fetchGraphQL from "./fetchGraphQL"
import GraphQL from "../use-graphql"
import invariant from "invariant"
import React from "react"
import sleep from "sleep"
import useTodosReducer from "./TodosAppReducer"

function TodosApp(props) {
	const [state, dispatch] = useTodosReducer()

	const queryState = GraphQL.useQuery(`
		query Todos { todos { id, todo } }
	`)

	const [, mutationAddTodo] = GraphQL.useLazyQuery(`
		mutation AddTodo($todo: String!) { addTodo(todo: $todo) { id, todo } }
	`)

	const [, mutationRemoveTodo] = GraphQL.useLazyQuery(`
		mutation RemoveTodo($id: ID!) { removeTodo(id: $id) { id, todo } }
	`)

	React.useEffect(
		React.useCallback(() => {
			if (!queryState.data) {
				return
			}
			// Simulate network request:
			setTimeout(() => {
				dispatch.setState(queryState.data.todos)
			}, 100)
		}, [dispatch, queryState]),
		[queryState.data]
	)

	const asyncHandleClickAddTodo = async e => {
		e.preventDefault()
		if (!state.todo) {
			return
		}
		// Simulate network request:
		await sleep(100)
		const res = await mutationAddTodo({ todo: state.todo })
		if (res.errors) {
			invariant(false, res.errors.map(error => error.message).join(", "))
			return
		}
		const { addTodo: { id, todo } } = res.data
		dispatch.addTodo(id, todo)
	}

	const asyncHandleClickRemoveTodo = id => async e => {
		e.preventDefault()
		// Simulate network request:
		await sleep(100)
		const res = await mutationRemoveTodo({ id })
		if (res.errors) {
			invariant(false, res.errors.map(error => error.message).join(", "))
			return
		}
		dispatch.removeTodo(id)
	}

	return (
		<form>
			<button onClick={asyncHandleClickAddTodo}>
				+
			</button>
			<input value={state.todo} onChange={e => dispatch.setTodo(e.target.value)} />
			{state.todos.length > 0 && (
				<ul>
					{state.todos.map(todo => (
						<li key={todo.id}>
							<button onClick={asyncHandleClickRemoveTodo(todo.id)}>
								-
							</button>
							{todo.todo}
						</li>
					))}
				</ul>
			)}
		</form>
	)
}

const App = props => (
	<GraphQL.Provider client={new GraphQL.Client({ fetchGraphQL })}>
		<TodosApp />
	</GraphQL.Provider>
)

export default App
