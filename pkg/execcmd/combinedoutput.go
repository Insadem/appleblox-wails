package execcmd

import (
	"errors"
	"io"
	"os/exec"
)

type lenReader interface {
	io.Reader
	Len() int
}

func CombinedOutput(cmd *exec.Cmd) (string, error) {
	if cmd == nil {
		return "", errors.New("cmd wasn't provided")
	}

	var o []byte
	r, ok := cmd.Stdout.(lenReader)
	if ok {
		o = make([]byte, r.Len())
		r.Read(o)
	}

	var e []byte
	r, ok = cmd.Stderr.(lenReader)
	if ok {
		e = make([]byte, r.Len())
		r.Read(e)
	}

	var err error
	if string(e) != "" {
		err = errors.New(string(e))
	}

	return string(o), err
}
