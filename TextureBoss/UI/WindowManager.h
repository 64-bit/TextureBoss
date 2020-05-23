#pragma once
#include <vector>

class Window;

class WindowManager
{
public:
	void OnFrame(float deltaT);

	void OpenWindow(Window* window);
private:

	std::vector<Window*> _openWindows;
};
