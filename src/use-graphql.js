import * as Context from "./Context"
import errorsIs from "./errorsIs"
import fetchAsGraphQL from "./fetchAsGraphQL"
import useLazyMutation from "./useLazyMutation"
import useLazyQuery from "./useLazyQuery"
import useQuery from "./useQuery"

const GraphQL = {
	Client: Context.Client,
	errorsIs,
	fetchAsGraphQL,
	Provider: Context.Provider,
	useLazyMutation,
	useLazyQuery,
	useQuery,
}

export default GraphQL
