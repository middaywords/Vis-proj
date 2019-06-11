"""
    File format_flow.py created on 2019/5/24 by kangjx
    Description: generate json data for sankey graph.

    Input : flow time files.
    Output: links and nodes for json file.
"""

import pandas as pd
import numpy as np
import json


if __name__ == '__main__':
    time_breakpoint = ['09-15', '10-15', '11-15', '12-30']

    locations = ["mainHall", "hallA", "hallB", "hallC", "hallD", "recreationArea", "other", "diningHall", "out",
                 "exhibition"]
    locIndex = {item: index for index, item in enumerate(locations)}

    out_file = open("formatted_out.txt", "w+")

    node_dict = {}
    cnt = 0
    for n in range(len(time_breakpoint) - 1):

        read_file_name = "flow3-" + time_breakpoint[n + 1] + ".csv"
        flow_data = pd.read_csv(read_file_name)
        for index, row in flow_data.iterrows():
            for j in range(1, len(locations) + 1):
                r = flow_data.iloc[index, j]
                if flow_data.iloc[index, j] <= 6:
                    pass
                else:
                    # put all out source nodes together
                    if locations[index] == "out":
                        source_name = "left_out"
                    else:
                        source_name = locations[index] + '-' + time_breakpoint[n]
                    if source_name not in node_dict:
                        node_dict[source_name] = cnt
                        cnt += 1

                    if locations[j - 1] == "out":
                        target_name = "right_out"
                    else:
                        target_name = locations[j - 1] + '-' + time_breakpoint[n + 1]
                    if target_name not in node_dict:
                        node_dict[target_name] = cnt
                        cnt += 1

                    if source_name != "left_out" or target_name != "right_out":
                        # format key "links"
                        out_file.write("{\"source\":%d" % node_dict[source_name] +
                                       ",\"target\":%d" % node_dict[target_name] +
                                       ",\"value\":%d},\n" % flow_data.iloc[index, j])

    out_file.close()

    # format key "node"
    node_dict_saved = []
    for item in node_dict:
        tmp_dict = {"node": node_dict[item], "name": item}
        node_dict_saved.append(tmp_dict)
    with open('node_dict.json', 'w') as outfile:
        json.dump(node_dict_saved, outfile)