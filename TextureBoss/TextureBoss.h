#pragma once

#include "UI/WindowManager.h"
//main application instance

class TextureBoss
{
public:

	void Init();

	void OnFrame(float deltaT);
private:

	void MenuBar();

	void DrawGLBackground(float deltaT);


	//managers

	WindowManager* _windowManager = nullptr;

	bool _showDebugMenu;
};