import * as Context from "./Context"
import invariant from "invariant"
import nullable from "nullable"
import React from "react"

function useLazyQuery(query) {
	invariant(
		typeof query === "string",
		"use-graphql: `useLazyQuery` expected a `query=<string>` argument.",
	)

	const [queryState, setQueryState] = React.useState({
		fetching: false,
		errors: null,
		data: null,
	})

	const client = React.useContext(Context.Context)

	const emitQuery = async (variables = {}) => {
		invariant(
			nullable.isNonNullableObject(variables),
			"use-graphql: `useLazyQuery` expected a `variables=<object>` argument. " +
			"You can use `{}` or omit the argument if there’s no variables.",
		)
		setQueryState({ fetching: true, errors: null, data: null })
		let res = null
		try {
			const fetched = await client.fetchGraphQL(query, variables)
			res = {
				fetching: false,
				errors: fetched.errors || null,
				data: fetched.data,
			}
		} catch (error) {
			res = {
				fetching: false,
				errors: [{ message: error.message }],
				data: null,
			}
		}
		setQueryState(res)
		return res
	}

	return [queryState, emitQuery]
}

export default useLazyQuery
