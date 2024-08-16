package process

import (
	"os"
	"syscall"
	"time"
)

func trackLife(p *os.Process) <-chan struct{} {
	c := make(chan struct{})

	go func() {
		defer close(c)

		for {
			time.Sleep(time.Millisecond * 50)
			if p == nil {
				return
			}

			err := p.Signal(syscall.Signal(0)) // err is nil if process exist
			if err != nil {
				return
			}
		}
	}()

	return c
}
