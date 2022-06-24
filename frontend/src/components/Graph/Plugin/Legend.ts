import { Chart, ChartType, Plugin } from 'chart.js';
import { colors } from 'lib/getRandomColor';
import { get } from 'lodash-es';

const getOrCreateLegendList = (
	chart: Chart,
	id: string,
	isLonger: boolean,
): HTMLUListElement => {
	const legendContainer = document.getElementById(id);
	let listContainer = legendContainer?.querySelector('ul');

	if (!listContainer) {
		listContainer = document.createElement('ul');
		listContainer.style.display = 'flex';
		// listContainer.style.flexDirection = isLonger ? 'column' : 'row';
		listContainer.style.margin = '0';
		listContainer.style.padding = '0';
		listContainer.style.overflowY = 'scroll';
		listContainer.style.justifyContent = isLonger ? 'start' : 'center';
		listContainer.style.alignItems = isLonger ? 'start' : 'center';
		listContainer.style.height = '100%';
		listContainer.style.flexWrap = 'wrap';
		listContainer.style.justifyContent = 'center';
		legendContainer?.appendChild(listContainer);
	}

	return listContainer;
};

export const legend = (id: string, isLonger: boolean): Plugin<ChartType> => {
	return {
		id: 'htmlLegend',
		afterUpdate(chart): void {
			const ul = getOrCreateLegendList(chart, id || 'legend', isLonger);

			// Remove old legend items
			while (ul.firstChild) {
				ul.firstChild.remove();
			}

			// Reuse the built-in legendItems generator
			const items = get(chart, [
				'options',
				'plugins',
				'legend',
				'labels',
				'generateLabels',
			])
				? get(chart, ['options', 'plugins', 'legend', 'labels', 'generateLabels'])(
						chart,
				  )
				: null;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			items?.forEach((item: Record<any, any>, index: number) => {
				const li = document.createElement('li');
				li.style.alignItems = 'center';
				li.style.cursor = 'pointer';
				li.style.display = 'flex';
				li.style.marginLeft = '10px';
				li.style.marginTop = '5px';

				li.onclick = (): void => {
					const { type } = chart.config;
					if (type === 'pie' || type === 'doughnut') {
						// Pie and doughnut charts only have a single dataset and visibility is per item
						chart.toggleDataVisibility(index);
					} else {
						chart.setDatasetVisibility(
							item.datasetIndex,
							!chart.isDatasetVisible(item.datasetIndex),
						);
					}
					chart.update();
				};

				// Color box
				const boxSpan = document.createElement('span');
				boxSpan.style.background = `${item.strokeStyle}` || `${colors[0]}`;
				boxSpan.style.borderColor = `${item?.strokeStyle}`;
				boxSpan.style.borderWidth = `${item.lineWidth}px`;
				boxSpan.style.display = 'inline-block';
				boxSpan.style.minHeight = '20px';
				boxSpan.style.marginRight = '10px';
				boxSpan.style.minWidth = '20px';
				boxSpan.style.borderRadius = '50%';

				if (item.text) {
					// Text
					const textContainer = document.createElement('span');
					textContainer.style.margin = '0';
					textContainer.style.padding = '0';
					textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

					const text = document.createTextNode(item.text);
					textContainer.appendChild(text);

					li.appendChild(boxSpan);
					li.appendChild(textContainer);
					ul.appendChild(li);
				}
			});
		},
	};
};
