// https://graphql.org/graphql-js/running-an-express-graphql-server/
const cors = require("cors")
const express = require("express")
const graphqlHTTP = require("express-graphql")
const { buildSchema } = require("graphql")

const schema = buildSchema(`
	type Query {
		todos: [Todo]!
	}
	type Mutation {
		reset: [Todo]!
		addTodo(todo: String!): Todo!
		removeTodo(id: ID!): Todo
	}
	type Todo {
		id: ID!
		todo: String!
	}
`)

const randomID = () => Math.random().toString(16).slice(2, 6)

const initialState = [
	{ id: randomID(), todo: "Grapes 🍇" },
	{ id: randomID(), todo: "Melons 🍈" },
	{ id: randomID(), todo: "Watermelons 🍉" },
	{ id: randomID(), todo: "Tangerines 🍊" },
	{ id: randomID(), todo: "Lemons 🍋" },
	{ id: randomID(), todo: "Bananas 🍌" },
	{ id: randomID(), todo: "Pineapples 🍍" },
	{ id: randomID(), todo: "Mangoes 🥭" },
]

let todos = [...initialState]

const rootValue = ({
	// Reset todos:
	reset(args) {
		todos = [...initialState]
		return todos
	},
	// Current todos:
	todos(args) {
		return todos
	},
	// Add a new todo:
	addTodo(args) {
		const todo = {
			id:   randomID(),
			todo: args.todo,
		}
		todos.unshift(todo)
		return todo
	},
	// Remove a todo:
	removeTodo(args) {
		const index = todos.findIndex(todo => todo.id === args.id)
		todos.splice(index, 1)
		return null
	},
})

;(() => {
	const app = express()
	app.use(
		"/graphql",
		cors(),
		graphqlHTTP({
			schema,
			rootValue,
			graphiql: true,
		})
	)
	app.listen(4000)
})()
