问题记录

当前主要问题

不同情况下的不同配置面板

- 当为直角坐标系（bar和line）的情况时，需要配置xColumn，yColumn，dimColumns
- 当为饼图时，只需要配置xColumn，yColumn
- 当为heatMap时，不允许用户配置，默认取前两列
- 当为numeric时，不允许用户配置，默认取数组第一项的第一个数值

- 当bar为单维度时（dimColumns配置为空），用户可选择是否排序，升序还是降序
- 当bar为多维度时，用户可以选择条形图堆积还是分组

