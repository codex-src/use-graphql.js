import * as Context from "./Context"
import invariant from "invariant"
import nullable from "nullable"
import React from "react"

function useLazyMutation(mutation) {
	invariant(
		typeof mutation === "string",
		"use-graphql: `useLazyMutation` expected a `mutation=<string>` argument."
	)

	const [mutationState, setMutationState] = React.useState({
		fetching: false,
		errors: null,
		data: null,
	})

	const client = React.useContext(Context.Context)

	const emitMutation = async (variables = {}) => {
		invariant(
			nullable.isNonNullableObject(variables),
			"use-graphql: `useLazyMutation` expected a `variables=<object>` argument. " +
			"You can use `{}` or omit the argument if there’s no variables."
		)
		setMutationState({ fetching: true, errors: null, data: null })
		let res = null
		try {
			const fetched = await client.fetchGraphQL(mutation, variables)
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
		setMutationState(res)
		return res
	}

	return [mutationState, emitMutation]
}

export default useLazyMutation
