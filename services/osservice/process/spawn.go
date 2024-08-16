package process

import (
	"os"

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

func spawnProcess() os.Process {

}

// SpawnProcess spawns a process based on a command in background and let developers control it.
// Cwd is optional, can be empty string.
func (ph ProcessHandler) SpawnProcess(command string, cwd string) (Process, error) {
	// ph.ep.Emit()

}
