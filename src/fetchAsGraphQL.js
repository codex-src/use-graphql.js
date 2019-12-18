import * as Context from "./Context"
import invariant from "invariant"
import nullable from "nullable"

async function fetchAsGraphQL(query, variables = {}) {
	invariant(
		typeof query === "string",
		"use-graphql: `fetchAsGraphQL` expected a `query=<string>` argument.",
	)
	invariant(
		nullable.isNonNullableObject(variables),
		"use-graphql: `fetchAsGraphQL` expected a `variables=<object>` argument. " +
		"You can use `{}` or omit the argument if there’s no variables.",
	)
	invariant(
		typeof Context.packageOptions.fetchGraphQL === "function",
		"use-graphql: `Provider` expected a `client=<object>` property. " +
		"Did you mean `<Provider client={new Client(options)}>`? " +
		"Please refer to https://git.io/JeQqg for documentation.",
	)
	let res = null
	try {
		res = await Context.packageOptions.fetchGraphQL(query, variables)
	} catch (error) {
		res = {
			fetching: false,
			errors: [{ message: error.message }],
			data: null,
		}
	}
	return res
}

export default fetchAsGraphQL
