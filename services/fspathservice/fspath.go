package fspathservice

import "appleblox/pkg/fspath"

type FSPathService struct{}

func (fs *FSPathService) HomeDir() (string, error) {
	return fspath.HomeDir.Get()
}

func (fs *FSPathService) DataDir() (string, error) {
	return fspath.DataDir.Get()
}
