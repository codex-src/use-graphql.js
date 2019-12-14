import babel from "rollup-plugin-babel"

const config = {
	external: ["invariant", "nullable", "react"],
	input:    "src/use-graphql.js",
	output:   { file: "build/use-graphql.js", format: "cjs" },
	plugins:  [babel({ exclude: "node_modules/**" })]
}

export default config
