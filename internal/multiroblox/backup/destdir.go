package backup

import (
	"appleblox/pkg/fspath"
	"errors"

	"os"
)

func destDir() (string, error) {
	backupDir, err := fspath.TMPDir.Get()
	if err != nil {
		return "", err
	}

	err = os.Mkdir(backupDir, 0777)
	if err != nil && !errors.Is(err, os.ErrExist) {
		return "", err
	}

	path, err := os.MkdirTemp(backupDir, "")
	return path, err
}
