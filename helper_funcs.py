a = {0: [0, 0.5, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 12.5, 13, 13.5, 14, 14.5, 15, 15.5],
52: [11, 12],
53: [10.5, 11.5],
55: [3.5, 9, 9.5, 10],
57: [1, 4],
59: [1.5],
60: [2],
62: [3],
64: [2.5]}

b = {k: [[val, 0.4] for val in a[k]] for k in a}

from pprint import pprint
# pprint(b)
a = {
64: [(8, 0.4), (8.5, 0.4), (9, 0.4), (9.5, 0.4), (10, 0.4), (10.5, 0.4), (11, 0.4), (11.5, 0.4), (12, 0.4), (12.5, 0.4), (13, 0.4), (13.5, 0.4), (14, 0.4), (14.5, 0.4), (15, 0.4), (15.5, 0.4)], 
    60: [(4, 0.4), (4.5, 0.4), (5, 0.4), (5.5, 0.4), (6, 0.4), (6.5, 0.4), (7, 0.4), (7.5, 0.4), (8, 0.4), (8.5, 0.4), (9, 0.4), (9.5, 0.4), (10, 0.4), (10.5, 0.4), (11, 0.4), (11.5, 0.4), (12, 0.4), (12.5, 0.4), (13, 0.4), (13.5, 0.4), (14, 0.4), (14.5, 0.4), (15, 0.4), (15.5, 0.4)], 
    69: [(12, 0.4), (12.5, 0.4), (13, 0.4), (13.5, 0.4), (14, 0.4), (14.5, 0.4), (15, 0.4), (15.5, 0.4)], 
    7: [(0, 0.4), (0.5, 0.4), (1, 0.4), (1.5, 0.4), (2, 0.4), (2.5, 0.4), (3, 0.4), (3.5, 0.4), (4, 0.4), (4.5, 0.4), (5, 0.4), (5.5, 0.4), (6, 0.4), (6.5, 0.4), (7, 0.4), (7.5, 0.4), (8, 0.4), (8.5, 0.4), (9, 0.4), (9.5, 0.4), (10, 0.4), (10.5, 0.4), (11, 0.4), (11.5, 0.4), (12, 0.4), (12.5, 0.4), (13, 0.4), (13.5, 0.4), (14, 0.4), (14.5, 0.4), (15, 0.4), (15.5, 0.4)]}
b = {k: [[val[0], val[1]] for val in a[k]] for k in a}

# pprint(b)

a = {0: [1, 2, 3, 4, 5, 9, 13, 14],
65: [6, 11],
67: [0, 7, 10, 12, 15],
69: [8]}
b = {k: [[val, 0.4] for val in a[k]] for k in a}
pprint(b)