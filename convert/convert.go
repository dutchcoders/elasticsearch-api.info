package main

// https://github.com/elastic/elasticsearch/tree/master/rest-api-spec/src/main/resources/rest-api-spec

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	var docs = []interface{}{}

	filepath.Walk(os.Args[1], func(path string, info os.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}

		if err != nil {
			return err
		}

		r, err := os.OpenFile(path, os.O_RDONLY, 0)
		if err != nil {
			panic(err)
		}

		var x interface{}
		err = json.NewDecoder(r).Decode(&x)
		if err != nil {
			fmt.Println(path, err.Error())
			return err
		}

		for name, obj := range x.(map[string]interface{}) {
			obj2 := obj.(map[string]interface{})
			obj2["name"] = name
			docs = append(docs, obj2)
		}

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
	// add version
	json.NewEncoder(os.Stdout).Encode(docs)
}
