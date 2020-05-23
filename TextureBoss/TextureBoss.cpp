#include "TextureBoss.h"
#include "imgui/imgui.h"
#include "UI/AboutBox.h"


void TextureBoss::Init()
{
	_windowManager = new WindowManager();
}

void TextureBoss::MenuBar()
{
	static bool _hlsl = false;
	static bool _glsl = true;
	static bool _aboutOpen = false;

	if (ImGui::BeginMainMenuBar())
	{
		if (ImGui::BeginMenu("File"))
		{
			if (ImGui::MenuItem("Open", "CTRL+Z")) {}
			ImGui::Separator();
			if (ImGui::MenuItem("Exit"))
			{
				//TODO:Unsaved code
				//_shouldQuit = true; //TODO:
			}
			ImGui::EndMenu();
		}
		if (ImGui::BeginMenu("Edit"))
		{
			if (ImGui::MenuItem("Undo", "CTRL+Z")) {}
			if (ImGui::MenuItem("Redo", "CTRL+Y", false, false)) {}  // Disabled item
			ImGui::Separator();
			if (ImGui::MenuItem("Cut", "CTRL+X")) {}
			if (ImGui::MenuItem("Copy", "CTRL+C")) {}
			if (ImGui::MenuItem("Paste", "CTRL+V")) {}
			ImGui::EndMenu();
		}
		if (ImGui::BeginMenu("Export"))
		{
			if (ImGui::MenuItem("GLSL", "", &_glsl))
			{
				_hlsl = false;
			}
			if (ImGui::MenuItem("HLSL", "", &_hlsl))
			{
				_glsl = false;
			}
			ImGui::Separator();
			ImGui::MenuItem("Export To Shader");
			ImGui::MenuItem("Export To PNG");
			ImGui::EndMenu();
		}
		if(ImGui::BeginMenu("Help"))
		{
			if(ImGui::MenuItem("About"))
			{
				//_aboutOpen = true;
				auto aboutWindow = new AboutBox();
				_windowManager->OpenWindow(aboutWindow);
			}

			ImGui::MenuItem("ImGUI Debug", "", &_showDebugMenu);
			ImGui::EndMenu();
		}

		if (_aboutOpen)
		{
			ImGui::SetNextWindowSize(ImVec2(320, 240), ImGuiCond_FirstUseEver);

			if (ImGui::Begin("About"))
			{
				ImGui::Text("TextureBoss");
				ImGui::Text("(C) Jonathan Linsner 2020");

				if (ImGui::Button("Close"))
				{
					_aboutOpen = false;
				}
			}
			ImGui::End();
		}

		ImGui::EndMainMenuBar();
	}
}

void TextureBoss::OnFrame(float deltaT)
{
	MenuBar();

	//Node Editor ?

	//Sidebar ?

	//Do this last
	_windowManager->OnFrame(deltaT);

	if(_showDebugMenu)
	{
		ImGui::ShowDemoWindow();
	}

	DrawGLBackground(deltaT);
}

void TextureBoss::DrawGLBackground(float deltaT)
{
	
}
