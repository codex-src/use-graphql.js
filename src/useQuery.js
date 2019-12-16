import * as Context from "./Context"
import invariant from "invariant"
import nullable from "nullable"
import React from "react"

function useQuery(query, variables = {}) {
	invariant(
		typeof query === "string",
		"use-graphql: `useQuery` expected a `query=<string>` argument."
	)

	invariant(
		nullable.isNonNullableObject(variables),
		"use-graphql: `useQuery` expected a `variables=<object>` argument. " +
		"You can use `{}` or omit the argument if there’s no variables."
	)

	const [queryState, setQueryState] = React.useState({
		fetching: true,
		errors: null,
		data: null,
	})

	const client = React.useContext(Context.Context)

	React.useEffect(
		React.useCallback(() => {
			const effect = async () => {
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
			}
			effect()
		}, [query, variables, client]),
		[]
	)

	return queryState
}

export default useQuery
