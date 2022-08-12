import json
import os
import tkinter

def debugger(text):
        print(text)
        
def play_kichiku(filein):

        filedir = os.path.abspath(filein)
        data = open(filedir,'r',encoding='utf-8')
        print(data)
        kck_data = json.load(data)
        jsonoutput = []
        print(kck_data)
        for i in kck_data:
                json_single = {}
                j = json_single
                for single_i in i:
                        print(single_i)
                        print(i[single_i])
                        if single_i == "offset":
                                continue
                        else:
                                j[single_i] = i[single_i]
                                continue
                if i['offset'] == 0:
                        videodir = os.path.abspath(i['video'])
                        os.startfile(videodir)
                        temp_offset = input("请指定偏移值:")
                        j['offset'] = temp_offset
                        if j['offset'] == "":
                                j['offset'] = 0
                        print("偏移值设置成功")
                else:
                        j['offset'] = i['offset']
                        print("此视频已设置偏移值")
                kotae = input("press [ENTER] to continue; d to delete this offset; q to quit:")
                matches_2delete = ["d", "D"]
                matches_2quit = ["q", "Q"]
                if any(x in kotae for x in matches_2quit):
                        break
                if any(x in kotae for x in matches_2delete):
                        #j["offset"] = temp_offset
                        j["offset"] = 0
                jsonoutput.append(json_single)
        kotae = input("w to write file, x for quit without writing file:")
        matches = ["w", "W"]
        if any(x in kotae for x in matches):
                data.close
                with open('data.json', 'w',encoding='utf-8') as out_file:
                        json.dump(jsonoutput, out_file, sort_keys = True, indent = 4,ensure_ascii = False)

        exit()

                


tkinter.messagebox.showinfo(title="Info", message="请选择文件")
turget_files = tkinter.filedialog.askfilenames(initialdir=os.getcwd())
if turget_files == '':
        tkinter.messagebox.showerror(title="Error", message="未选择文件")
        os._exit(0)
else:
        for single_file in turget_files:
                play_kichiku(single_file)

		


