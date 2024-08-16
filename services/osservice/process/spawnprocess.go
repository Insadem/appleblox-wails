package process

import (
	"appleblox/pkg/execcmd"
	"os"
	"syscall"
)

type processInfo struct {
	Action string
	Data   string
}

func spawnProcess(command string, cwd string) (*os.Process, <-chan processInfo) {
	c := make(chan processInfo)
	cmd := execcmd.ExecCommand(command, &execcmd.Config{
		Background: true,
		Directory:  cwd,
		Stdout: &callbackWriter{
			Callback: func(b []byte) {
				c <- processInfo{
					Action: "stdOut",
					Data:   string(b),
				}
			},
		},
		Stderr: &callbackWriter{
			Callback: func(b []byte) {
				c <- processInfo{
					Action: "stdErr",
					Data:   string(b),
				}
			},
		},
	})

	p := cmd.Process

	if p == nil || p.Signal(syscall.Signal(0)) != nil {
		close(c)
		return nil, c
	}

	go func() {
		defer close(c)

		<-trackLife(p)
		c <- processInfo{
			Action: "exit",
		}
	}()
	return p, c
}
