package process

import (
	"errors"
	"sync/atomic"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type ProcessHandler struct {
	ep *application.EventProcessor
}

func NewHandler(ep *application.EventProcessor) ProcessHandler {
	return ProcessHandler{
		ep: ep,
	}
}

// incremented by 1 each time, used for new processes (aka internal UUID)
var latestProcessId atomic.Int32

// SpawnProcess spawns a process based on a command in background and let developers control it.
// Cwd is optional, can be empty string.
func (ph ProcessHandler) SpawnProcess(command string, cwd string) (Process, error) {
	p, c := spawnProcess(command, cwd)
	if p == nil {
		return Process{}, errors.New("couldn't spawn process with command: " + command)
	}

	go func() {
		for v := range c {
			ph.ep.Emit(&application.WailsEvent{
				Name: "spawnedProcess",
				Data: v.Data, // TODO: rewrite to be right type, this is stub
			})
			// forward to event
		}
	}()
	id := latestProcessId.Add(1)
	// ph.ep.Emit(&application.WailsEvent{
	// 	Name: "spawnedProcess",
	// 	Data: ,
	// })

	return Process{
		ID:  int(id),
		PID: p.Pid,
	}, nil
}
