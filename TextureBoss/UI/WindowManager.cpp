#include "WindowManager.h"
#include "Window.h"
#include <cassert>

void WindowManager::OnFrame(float deltaT)
{

	for(auto window : _openWindows)
	{
		window->OnFrame(deltaT);
	}

	for(int i = 0; i < _openWindows.size();i++)
	{
		if(_openWindows[i]->IsClosed())
		{
			delete _openWindows[i];
			_openWindows.erase(_openWindows.begin() + i);
			i--;
		}
	}
}

void WindowManager::OpenWindow(Window * window)
{
	assert(window != nullptr);
	window->OnOpen();
	_openWindows.push_back(window);
}
