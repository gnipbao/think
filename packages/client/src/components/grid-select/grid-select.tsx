import { Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useMemo, useState } from 'react';

import { GridCell } from './grid-cell';

const { Text } = Typography;

export type RegionSelectionProps = {
  rows?: number;
  cols?: number;
  onSelect: (arg: { rows: number; cols: number }) => void;
  cellSize?: number;
  disabled?: boolean;
  styles?: {
    active?: React.CSSProperties;
    hover?: React.CSSProperties;
    cell?: React.CSSProperties;
    grid?: React.CSSProperties;
    disabled?: React.CSSProperties;
  };
};

type CoordsType = {
  x: number;
  y: number;
};

const getBaseStyles = (cols, cellSize) => ({
  grid: {
    position: 'relative',
    display: 'grid',
    color: '#444',
    margin: '8px 0',
    gridGap: '4px 6px',
    gridTemplateColumns: Array(cols).fill(`${cellSize}px`).join(' '),
  },
});

export const GridSelect = ({
  onSelect,
  rows = 10,
  cols = 10,
  disabled = false,
  cellSize = 16,
  styles,
}: RegionSelectionProps) => {
  const [hoverCell, setHoverCell] = useState<CoordsType>(null);

  const onClick = useCallback(
    ({ x, y, isCellDisabled }) => {
      onSelect({
        rows: y + 1,
        cols: x + 1,
      });
    },
    [onSelect]
  );

  const onClickPanel = useCallback(() => {
    if (hoverCell.x + 1 > 0 && hoverCell.y + 1 > 0) {
      onSelect({
        rows: hoverCell.y + 1,
        cols: hoverCell.x + 1,
      });
    }
  }, [hoverCell, onSelect]);

  const onHover = useCallback(({ x, y, isCellDisabled }) => {
    if (isCellDisabled) {
      return setHoverCell(null);
    }
    setHoverCell({ x, y });
  }, []);

  const cells = useMemo(() => {
    const cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isHover = hoverCell && x <= hoverCell.x && y <= hoverCell.y;
        const isCellDisabled = disabled;
        cells.push(
          <GridCell
            id={x + '-' + y}
            key={x + '-' + y}
            onMouseDown={(e) => {
              e.stopPropagation();
              onClick({ x, y, isCellDisabled });
            }}
            onMouseEnter={onHover.bind(null, { x, y, isCellDisabled })}
            hover={isHover}
            disabled={isCellDisabled}
            styles={styles}
            cellSize={cellSize}
          />
        );
      }
    }
    return cells;
  }, [rows, cols, disabled, cellSize, hoverCell, styles, onClick, onHover]);

  const baseStyles = useMemo(() => getBaseStyles(cols, cellSize), [cols, cellSize]);

  return (
    <div onMouseDown={onClickPanel}>
      <div
        style={
          {
            ...baseStyles.grid,
            ...(styles && styles.grid ? styles.grid : {}),
          } as React.CSSProperties
        }
        onMouseLeave={() => setHoverCell(null)}
      >
        {cells}
      </div>
      <footer style={{ textAlign: 'center' }}>
        <Text>{hoverCell ? `${hoverCell.y + 1} x ${hoverCell.x + 1}` : null}</Text>
      </footer>
    </div>
  );
};
