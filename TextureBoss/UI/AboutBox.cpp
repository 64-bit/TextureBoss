#include "AboutBox.h"
#include "imgui/imgui.h"

using namespace std;

void AboutBox::OnFrame(float deltaT)
{
	ImGui::SetNextWindowSize(ImVec2(320, 240), ImGuiCond_FirstUseEver);

	string title = string("About###") + to_string(_windowID);

	if (ImGui::Begin(title.c_str()))
	{
		ImGui::Text("TextureBoss");
		ImGui::Text("(C) Jonathan Linsner 2020");

		if (ImGui::Button("Close"))
		{
			Close();
		}
	}
	ImGui::End();
}
