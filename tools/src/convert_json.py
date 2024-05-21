import json
import argparse
import pandas as pd

def load_json(filename=None):
    '''
    loads user data into a list. Each list is a user, each user contains ['_id', 'ID', 'password', 'data']

    access information by using one of these keys, usually 'data' like load_json(filename)[userindex]['data']

    each node in user data contains a list of data accumulated through the questions

    Instructions:

    python convert_json.py -f gentle_data.json -o gentle_output

    gentle_output has no extensions. The output will be gentle_output_Nodes.csv and gentle_output_Links.csv
    '''
    print(filename)
    data = [json.loads(line) for line in open(filename, 'r')]
    # data = json.load(open(filename, 'r'))
    return data

def json_to_df(data):

    # Generate a list of columns we need to fill from multiple levels of the json information
    column_list = []

    usr_info_columns = data[0].keys()
    node_info = data[0]['data']['nodes']
    node_data_columns = node_info[1].keys()

    column_list.extend(list(usr_info_columns))
    column_list.extend(list(node_data_columns))

    data_records = []
    link_records = []

    # Iterate through the users and fill the information in each column
    for user in data:
        
        user['_id']
        user['ID']
        user['password']

        for node in user['data']['nodes']:
            # Fill node data with user information
            node_dict = node
            node_dict['_id'] = user['_id']
            node_dict['ID'] = user['ID']
            node_dict['password'] = user['password']

            node_keys = list(node_dict.keys())
            # The first node "You" is not consistent with the rest of the data, fill with "None" values
            absent_columns = set(column_list).difference(set(node_keys))
            for absent_column in absent_columns:
                node_dict[absent_column] = None

            # record data from nodes
            data_records.append(node_dict)

        for link in user['data']['links']:
            # Fill node data with user information
            link_dict = link
            link_dict['_id'] = user['_id']
            link_dict['ID'] = user['ID']
            link_dict['password'] = user['password']

            link_records.append(link_dict)

    node_df = pd.DataFrame.from_dict(data_records)
    link_df = pd.DataFrame.from_dict(link_records)

    node_df.insert(0, '_id', node_df.pop('_id'))
    node_df.insert(0, 'ID', node_df.pop('ID'))
    node_df.insert(0, 'password', node_df.pop('password'))

    link_df.insert(0, '_id', link_df.pop('_id'))
    link_df.insert(0, 'ID', link_df.pop('ID'))
    link_df.insert(0, 'password', link_df.pop('password'))
    
    return node_df, link_df



if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Converts json to csv format')
    parser.add_argument('-file', metavar='-f', type=str, help='filename (json)')
    parser.add_argument('-out', metavar='-o', type=str, help='filename (Do not include .csv)')
    args = parser.parse_args()
    print(args)
    # if parser.file is None:
    #     gentle_data = load_json("eight_user.json")
    #     args.out = "Gentle"

        
    gentle_data = load_json(args.file)
    
    node_df, link_df = json_to_df(gentle_data)

    out_node = args.out+ "_Nodes.csv"
    out_links = args.out + "_Links.csv"

    link_df.to_csv(out_links, index=False)
    node_df.to_csv(out_node, index=False)
        # print(user['_id'])
