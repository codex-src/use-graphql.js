import invariant from "invariant"

// https://golang.org/pkg/errors/#Is
function errorsIs(errors, targetError) {
	invariant(
		(errors === null || Array.isArray(errors)) && typeof targetError === "string",
		"use-graphql: `errorsIs` expected arguments `errors=<array>` and `targetError=<string>`."
	)
	if (errors === null) {
		return false
	}
	for (const error of errors) {
		if (error.message === targetError) {
			return true
		}
	}
	return false
}

export default errorsIs
