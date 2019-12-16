// relay.dev/docs/en/experimental/step-by-step#22-a-fetchgraphql-helper
async function fetchGraphQL(query, variables = {}) {
	const res = await fetch("http://localhost:4000/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json"	},
		body: JSON.stringify({
			query,
			variables,
		}),
	})
	return await res.json()
}

export default fetchGraphQL
