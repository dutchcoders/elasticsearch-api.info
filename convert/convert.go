package main

import (
	"encoding/json"
	"os"
	"path/filepath"
)

func main() {
	var docs = []interface{}{}

	filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		r, err := os.OpenFile(path, os.O_RDONLY, 0)
		if err != nil {
			panic(err)
		}

		var x interface{}
		json.NewDecoder(r).Decode(&x)

		docs = append(docs, x)

		return err
	})
	// fmt.Printf("%#v", docs)
	/*
			w := os.Create("docs.json")

			tmpl := template.Must(template.New("").Parse(`
		{{- range $doc := . }}
		{{- range $key, $val := $doc }}
		{{ $key -}}
		{{ $val.methods }}
		{{ $val.url.path }}
		{{ $val.url.paths }}
		{{ end -}}
		{{ end -}}`))

			tmpl.Execute(os.Stdout, docs)
	*/
	json.NewEncoder(os.Stdout).Encode(docs)
}
