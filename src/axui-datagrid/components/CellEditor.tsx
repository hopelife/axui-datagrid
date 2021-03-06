import * as React from 'react';
import { IDataGrid } from '../common/@types';
import { DataGridEnums } from '../common/@enums';

interface IProps {
  col: IDataGrid.ICol;
  li: number;
  item: any;
  value: any;
  columnHeight: number;
  lineHeight: number;
  columnBorderWidth: number;
  colAlign: string;
  setStoreState: IDataGrid.setStoreState;
  dispatch: IDataGrid.dispatch;
  inlineEditingCell: IDataGrid.IEditingCell;
  focusedRow: number;
  focusedCol: number;
}

class CellEditor extends React.PureComponent<IProps> {
  inputTextRef: React.RefObject<HTMLInputElement>;
  activeComposition: boolean = false;
  lastEventName: string = '';

  constructor(props: IProps) {
    super(props);

    this.inputTextRef = React.createRef();
  }

  onEventInput = (
    eventName: DataGridEnums.EventNames,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const {
      setStoreState,
      dispatch,
      inlineEditingCell = {},
      col,
      li,
    } = this.props;

    switch (eventName) {
      case DataGridEnums.EventNames.BLUR:
        // console.log('eventInput blur : setStoreState');
        setStoreState({
          isInlineEditing: false,
          inlineEditingCell: {},
        });

        if (!this.activeComposition) {
          if (this.lastEventName === 'update') {
            dispatch(DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
          } else {
            dispatch(DataGridEnums.DispatchTypes.UPDATE, {
              row: li,
              colIndex: col.colIndex,
              value: e.currentTarget.value,
              eventWhichKey: e.which,
            });
          }
        }

        break;
      case DataGridEnums.EventNames.KEYUP:
        switch (e.which) {
          case DataGridEnums.KeyCodes.ESC:
            setStoreState({
              isInlineEditing: false,
              inlineEditingCell: {},
            });

            this.lastEventName = 'esc';

            dispatch(DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
            break;
          case DataGridEnums.KeyCodes.UP_ARROW:
          case DataGridEnums.KeyCodes.DOWN_ARROW:
          case DataGridEnums.KeyCodes.ENTER:
            if (!this.activeComposition) {
              // console.log('eventInput enter : setStoreState');
              this.lastEventName = 'update';

              dispatch(DataGridEnums.DispatchTypes.UPDATE, {
                row: inlineEditingCell.rowIndex,
                colIndex: inlineEditingCell.colIndex,
                value: e.currentTarget.value,
                eventWhichKey: e.which,
              });
            }
            break;
          default:
            break;
        }

        break;
      default:
        break;
    }
  };

  handleUpdateValue: IDataGrid.CellEditorDataUpdate = (value: any, options) => {
    const { dispatch, li, col } = this.props;
    const { keepEditing = false, updateItem = false } = options || {};

    // console.log('handleUpdateValue UPDATE : dispatch');
    dispatch(
      updateItem
        ? DataGridEnums.DispatchTypes.UPDATE_ITEM
        : DataGridEnums.DispatchTypes.UPDATE,
      {
        row: li,
        colIndex: col.colIndex,
        value,
        eventWhichKey: 'custom-editor-action',
        keepEditing,
      },
    );
  };

  handleCancelEdit = () => {
    const { setStoreState, dispatch } = this.props;

    // console.log('handleCancelEdit : setStoreState');
    setStoreState({
      isInlineEditing: false,
      inlineEditingCell: {},
    });

    dispatch(DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
  };

  handleCustomEditorFocus = () => {
    const { setStoreState, li, col } = this.props;

    // console.log('handleCustomEditorFocus : setStoreState');
    setStoreState({
      isInlineEditing: true,
      inlineEditingCell: {
        rowIndex: li,
        colIndex: col.colIndex,
        editor: col.editor,
      },
    });
  };

  handleCustomEditorBlur = () => {
    const { setStoreState, dispatch } = this.props;

    setStoreState({
      isInlineEditing: false,
      inlineEditingCell: {},
    });

    dispatch(DataGridEnums.DispatchTypes.FOCUS_ROOT, {});
  };

  inputTextRender = (value: any, disable: boolean = false) => {
    return (
      <input
        type="text"
        ref={this.inputTextRef}
        onCompositionUpdate={() => {
          this.activeComposition = true;
        }}
        onCompositionEnd={() => {
          setTimeout(() => {
            this.activeComposition = false;
          });
        }}
        onFocus={e => {}}
        onBlur={e => {
          this.onEventInput(DataGridEnums.EventNames.BLUR, e as any);
        }}
        onKeyUp={e => {
          this.onEventInput(DataGridEnums.EventNames.KEYUP, e as any);
        }}
        data-inline-edit
        defaultValue={value}
      />
    );
  };

  handleCheckboxValue = (value: boolean) => {
    const { dispatch, li, col } = this.props;

    dispatch(DataGridEnums.DispatchTypes.UPDATE, {
      row: li,
      colIndex: col.colIndex,
      value: value,
      eventWhichKey: 'click-checkbox',
    });
  };

  checkboxRender = (
    value: any,
    label: React.ReactNode | string = '',
    disabled: boolean = false,
  ) => {
    const {
      columnHeight,
      lineHeight,
      columnBorderWidth,
      colAlign,
    } = this.props;

    let justifyContent: string = '';
    switch (colAlign) {
      case 'center':
        justifyContent = 'center';
        break;
      case 'right':
        justifyContent = 'flex-end';
        break;
      default:
    }

    return (
      <span
        data-span={'checkbox-editor'}
        className={`${disabled ? 'disabled' : ''}`}
        style={{
          height: columnHeight - columnBorderWidth + 'px',
          lineHeight: lineHeight + 'px',
          justifyContent,
        }}
        onClick={() => {
          if (!disabled) {
            this.handleCheckboxValue(!value);
          }
        }}
      >
        <div
          className="axui-datagrid-check-box"
          data-checked={value}
          style={{
            width: lineHeight + 'px',
            height: lineHeight + 'px',
          }}
        />
        <label
          style={{
            height: lineHeight + 'px',
            lineHeight: lineHeight + 'px',
          }}
        >
          {label}
        </label>
      </span>
    );
  };

  componentDidMount() {
    if (this.inputTextRef.current) {
      this.activeComposition = false;

      const {
        col: { editor: colEditor },
      } = this.props;
      const editor: IDataGrid.IColEditor =
        colEditor === 'text'
          ? { type: 'text' }
          : (colEditor as IDataGrid.IColEditor);
      if (editor.activeType !== 'always') {
        this.inputTextRef.current.focus();
      }
    }
  }

  handleInputTextSelect = (inputCurrent: any) => {
    const {
      col: { editor: colEditor },
    } = this.props;
    const editor: IDataGrid.IColEditor =
      colEditor === 'text'
        ? { type: 'text' }
        : (colEditor as IDataGrid.IColEditor);
    if (editor.activeType !== 'always') {
      inputCurrent.select();
    }
  };

  render() {
    const { item, value, col, li } = this.props;

    const editor: IDataGrid.IColEditor =
      col.editor === 'text'
        ? { type: 'text' }
        : (col.editor as IDataGrid.IColEditor);

    const disabled = editor.disable
      ? editor.disable({
          col: col,
          rowIndex: li,
          colIndex: col.colIndex || 0,
          item,
          value,
        })
      : false;

    switch (editor.type) {
      case 'text':
        return this.inputTextRender(value);
      case 'checkbox':
        return this.checkboxRender(value, editor.label, disabled);
      default:
        if (!editor.render) {
          return this.inputTextRender(value);
        }

        return editor.render({
          col: col,
          li,
          colIndex: col.colIndex || 0,
          item,
          value,
          update: this.handleUpdateValue,
          cancel: this.handleCancelEdit,
          focus: this.handleCustomEditorFocus,
          blur: this.handleCustomEditorBlur,
        });
    }
  }
}

export default CellEditor;
