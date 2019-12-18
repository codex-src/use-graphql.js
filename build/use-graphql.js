'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var invariant = _interopDefault(require('invariant'));
var nullable = _interopDefault(require('nullable'));
var React = _interopDefault(require('react'));

const Context = React.createContext({});
const packageOptions = {
  fetchGraphQL: null
};
function Client(options) {
  invariant(nullable.isNonNullableObject(options) && typeof options.fetchGraphQL === "function", "use-graphql: `Client` expected a `fetchGraphQL=<function>` property. " + "Did you mean `new Client(options)`? " + "Please refer to https://git.io/JeQqg for documentation.");
  Object.assign(packageOptions, options);
  return packageOptions;
}
function Provider(props) {
  invariant(props.client, "use-graphql: `Provider` expected a `client=<object>` property. " + "Did you mean `<Provider client={new Client(options)}>`? " + "Please refer to https://git.io/JeQqg for documentation.");
  const {
    Provider
  } = Context;
  return React.createElement(Provider, {
    value: props.client
  }, props.children);
}

function errorsIs(errors, targetError) {
  invariant((errors === null || Array.isArray(errors)) && typeof targetError === "string", "use-graphql: `errorsIs` expected arguments `errors=<array>` and `targetError=<string>`.");

  if (errors === null) {
    return false;
  }

  for (const error of errors) {
    if (error.message === targetError) {
      return true;
    }
  }

  return false;
}

async function fetchAsGraphQL(query, variables = {}) {
  invariant(typeof query === "string", "use-graphql: `fetchAsGraphQL` expected a `query=<string>` argument.");
  invariant(nullable.isNonNullableObject(variables), "use-graphql: `fetchAsGraphQL` expected a `variables=<object>` argument. " + "You can use `{}` or omit the argument if there’s no variables.");
  invariant(typeof packageOptions.fetchGraphQL === "function", "use-graphql: `Provider` expected a `client=<object>` property. " + "Did you mean `<Provider client={new Client(options)}>`? " + "Please refer to https://git.io/JeQqg for documentation.");
  let res = null;

  try {
    res = await packageOptions.fetchGraphQL(query, variables);
  } catch (error) {
    res = {
      fetching: false,
      errors: [{
        message: error.message
      }],
      data: null
    };
  }

  return res;
}

function useLazyMutation(mutation) {
  invariant(typeof mutation === "string", "use-graphql: `useLazyMutation` expected a `mutation=<string>` argument.");
  const [mutationState, setMutationState] = React.useState({
    fetching: false,
    errors: null,
    data: null
  });
  const client = React.useContext(Context);

  const emitMutation = async (variables = {}) => {
    invariant(nullable.isNonNullableObject(variables), "use-graphql: `useLazyMutation` expected a `variables=<object>` argument. " + "You can use `{}` or omit the argument if there’s no variables.");
    setMutationState({
      fetching: true,
      errors: null,
      data: null
    });
    let res = null;

    try {
      const fetched = await client.fetchGraphQL(mutation, variables);
      res = {
        fetching: false,
        errors: fetched.errors || null,
        data: fetched.data
      };
    } catch (error) {
      res = {
        fetching: false,
        errors: [{
          message: error.message
        }],
        data: null
      };
    }

    setMutationState(res);
    return res;
  };

  return [mutationState, emitMutation];
}

function useLazyQuery(query) {
  invariant(typeof query === "string", "use-graphql: `useLazyQuery` expected a `query=<string>` argument.");
  const [queryState, setQueryState] = React.useState({
    fetching: false,
    errors: null,
    data: null
  });
  const client = React.useContext(Context);

  const emitQuery = async (variables = {}) => {
    invariant(nullable.isNonNullableObject(variables), "use-graphql: `useLazyQuery` expected a `variables=<object>` argument. " + "You can use `{}` or omit the argument if there’s no variables.");
    setQueryState({
      fetching: true,
      errors: null,
      data: null
    });
    let res = null;

    try {
      const fetched = await client.fetchGraphQL(query, variables);
      res = {
        fetching: false,
        errors: fetched.errors || null,
        data: fetched.data
      };
    } catch (error) {
      res = {
        fetching: false,
        errors: [{
          message: error.message
        }],
        data: null
      };
    }

    setQueryState(res);
    return res;
  };

  return [queryState, emitQuery];
}

function useQuery(query, variables = {}) {
  invariant(typeof query === "string", "use-graphql: `useQuery` expected a `query=<string>` argument.");
  invariant(nullable.isNonNullableObject(variables), "use-graphql: `useQuery` expected a `variables=<object>` argument. " + "You can use `{}` or omit the argument if there’s no variables.");
  const [queryState, setQueryState] = React.useState({
    fetching: true,
    errors: null,
    data: null
  });
  const client = React.useContext(Context);
  React.useEffect(React.useCallback(() => {
    const effect = async () => {
      let res = null;

      try {
        const fetched = await client.fetchGraphQL(query, variables);
        res = {
          fetching: false,
          errors: fetched.errors || null,
          data: fetched.data
        };
      } catch (error) {
        res = {
          fetching: false,
          errors: [{
            message: error.message
          }],
          data: null
        };
      }

      setQueryState(res);
    };

    effect();
  }, [query, variables, client]), []);
  return queryState;
}

const GraphQL = {
  Client: Client,
  errorsIs,
  fetchAsGraphQL,
  Provider: Provider,
  useLazyMutation,
  useLazyQuery,
  useQuery
};

module.exports = GraphQL;
