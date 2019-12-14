import invariant from "invariant"
import nullable from "nullable"
import React from "react"

export const Context = React.createContext({})

export const packageOptions = {
	fetchGraphQL: null
}

export function Client(options) {
	invariant(
		nullable.isNonNullableObject(options) && typeof options.fetchGraphQL === "function",
		"use-graphql: `Client` expected a `fetchGraphQL=<function>` property. " +
		"Did you mean `new Client(options)`? " +
		"Please refer to https://git.io/JeQqg for documentation."
	)
	Object.assign(packageOptions, options)
	return packageOptions
}

export function Provider(props) {
	invariant(
		props.client,
		"use-graphql: `Provider` expected a `client=<object>` property. " +
		"Did you mean `<Provider client={new Client(options)}>`? " +
		"Please refer to https://git.io/JeQqg for documentation."
	)
	const { Provider } = Context
	return (
		<Provider value={props.client}>
			{props.children}
		</Provider>
	)
}
