package fsservice

import "os"

type FSService struct {
}

// CreateDirectory creates a directory or multiple directories recursively.
func (s *FSService) CreateDirectory(path string) error {
	return os.MkdirAll(path, 0755)
}

// Remove removes a directory or file. If the given path is a directory, this function recursively removes all contents of the specific directory.
func (s *FSService) Remove(path string) error {
	return os.RemoveAll(path)
}

// ReadFile reads a text file.
func (s *FSService) ReadFile(path string) (string, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	return string(b), nil
}

// WriteFile writes a text file.
func (s *FSService) WriteFile(path string, data string) error {
	return os.WriteFile(path, []byte(data), 0755)
}
