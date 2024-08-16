package process

import "testing"

func TestCallbackWriter(t *testing.T) {
	// TODO: TDD, implement test first
	cw := callbackWriter{
		Callback: func(b []byte) {
			s := string(b)
			if s != "test" {
				t.Error("expected test but got: ", s)
			}
		},
	}
	cw.Write([]byte("test"))
}
