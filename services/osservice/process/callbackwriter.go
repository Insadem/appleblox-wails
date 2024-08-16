package process

import (
	"io"
)

type callbackWriter struct {
	Callback func(b []byte)
}

func (cw *callbackWriter) Write(b []byte) (n int, err error) {
	if cw.Callback != nil {
		n = len(b)
		cw.Callback(b)
	}

	return
}

var _ io.Writer = (*callbackWriter)(nil) // Validate interface implementation
