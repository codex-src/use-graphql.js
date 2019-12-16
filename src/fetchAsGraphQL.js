import * as Context from "./Context"
import invariant from "invariant"

async function fetchAsGraphQL(query, variables = {}) {
	invariant(
		typeof Context.packageOptions.fetch === "function",
		"use-graphql: `Provider` expected a `client=<object>` property. " +
		"Did you mean `<Provider client={new Client(options)}>`? " +
		"Please refer to https://git.io/JeQqg for documentation."
	)
	let res = null
	try {
		res = await Context.packageOptions.fetch(query, variables)
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
