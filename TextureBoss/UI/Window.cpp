#include "Window.h"

long Window::_nextWindowID = 0;

void Window::OnOpen()
{
	_windowID = _nextWindowID++;
}

void Window::Close()
{
	_isClosed = true;
}

bool Window::IsClosed()
{
	return _isClosed;
}
