#include <stdio.h>
#include <windows.h>
#include <tlhelp32.h>
#include <direct.h>

int main (int argc, char **argv){
	// start aria2c
	PROCESS_INFORMATION pi;
	STARTUPINFO si;
	ZeroMemory(&si, sizeof(si));
	ZeroMemory(&pi, sizeof(pi));

	char cmd[65535] = {0};
	sprintf(cmd, "%s\\..\\", argv[0]);
	_chdir(cmd);

	if(argv[1])
	{
		if (strcmp(argv[1], "aria2://stop/") == 0){
			system("taskkill /f /t /im aria2c.exe");
		}
		else if (strcmp(argv[1], "aria2://stop-with-process/") == 0){
			// get parent pid
			int ppid = -1;
			int pid = -1;
			HANDLE h = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
			PROCESSENTRY32 pe = { 0 };
			pe.dwSize = sizeof(PROCESSENTRY32);

			pid = GetCurrentProcessId();

			if( Process32First(h, &pe)) {
				do {
					if (pe.th32ProcessID == pid) {
						ppid = pe.th32ParentProcessID;
					}
				} while( Process32Next(h, &pe));
			}

			CloseHandle(h);

			sprintf(cmd, "aria2c.exe -D --conf-path=aria2.conf --stop-with-process=%d", ppid);
			CreateProcess(NULL,cmd,NULL,NULL,0,CREATE_NO_WINDOW,NULL,NULL,&si,&pi);
		}
		else if (strcmp(argv[1], "aria2://start/") == 0){
			sprintf(cmd, "aria2c.exe -D --conf-path=aria2.conf");
			CreateProcess(NULL,cmd,NULL,NULL,0,CREATE_NO_WINDOW,NULL,NULL,&si,&pi);
		}
	}
	else {

		DWORD id = 0;       // ����ID
		PROCESSENTRY32 pe;  // ������Ϣ
		pe.dwSize = sizeof(PROCESSENTRY32);
		HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0); // ��ȡϵͳ�����б�
		if (Process32First(hSnapshot, &pe))      // ����ϵͳ�е�һ�����̵���Ϣ
		{
			do
			{
				if (0 == _stricmp(pe.szExeFile, "aria2c.exe")) // �����ִ�Сд�Ƚ�
				{
					id = pe.th32ProcessID;
					break;
				}
			} while (Process32Next(hSnapshot, &pe));      // ��һ������
		}

		CloseHandle(hSnapshot);     // ɾ������

		if(id == 0) {
			sprintf(cmd, "aria2c.exe -D --conf-path=aria2.conf");
			CreateProcess(NULL,cmd,NULL,NULL,0,CREATE_NO_WINDOW,NULL,NULL,&si,&pi);
		}
	}

	return 0 ;
}