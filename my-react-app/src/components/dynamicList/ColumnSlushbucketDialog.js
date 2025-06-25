import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PropTypes from "prop-types";

const ColumnSlushbucketDialog = ({
  open,
  onClose,
  onOk,
  columns,
  selectedColumns: initialSelectedColumns
}) => {
  // Use columns prop for available columns
  const [leftList, setLeftList] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);

  useEffect(() => {
    if (open && columns) {
      const allElements = columns.map(col => col.element);
      setLeftList(allElements.filter(col => !initialSelectedColumns.includes(col)));
      setRightList([...initialSelectedColumns]);
      setLeftSelected([]);
      setRightSelected([]);
    }
  }, [open, columns, initialSelectedColumns]);

  const handleAdd = () => {
    setRightList([...rightList, ...leftSelected]);
    setLeftList(leftList.filter(item => !leftSelected.includes(item)));
    setLeftSelected([]);
  };
  const handleRemove = () => {
    setLeftList([...leftList, ...rightSelected]);
    setRightList(rightList.filter(item => !rightSelected.includes(item)));
    setRightSelected([]);
  };
  const handleOk = () => {
    onOk(rightList);
  };

  // Helper to get label from element
  const getLabel = (element) => {
    const col = columns.find(c => c.element === element);
    return col ? col.column_label : element;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Columns</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={5}>
            <Paper variant="outlined" sx={{ height: 300, overflow: 'auto' }}>
              <List dense>
                {leftList.map((element) => (
                  <ListItem
                    key={element}
                    button
                    selected={leftSelected.includes(element)}
                    onClick={() => setLeftSelected(
                      leftSelected.includes(element)
                        ? leftSelected.filter(item => item !== element)
                        : [...leftSelected, element]
                    )}
                  >
                    <ListItemText primary={getLabel(element)} secondary={element} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={2} container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: 300 }}>
            <Button variant="outlined" onClick={handleAdd} disabled={leftSelected.length === 0} sx={{ mb: 1 }}>&gt;</Button>
            <Button variant="outlined" onClick={handleRemove} disabled={rightSelected.length === 0}>&lt;</Button>
          </Grid>
          <Grid item xs={5}>
            <Paper variant="outlined" sx={{ height: 300, overflow: 'auto' }}>
              <List dense>
                {rightList.map((element) => (
                  <ListItem
                    key={element}
                    button
                    selected={rightSelected.includes(element)}
                    onClick={() => setRightSelected(
                      rightSelected.includes(element)
                        ? rightSelected.filter(item => item !== element)
                        : [...rightSelected, element]
                    )}
                  >
                    <ListItemText primary={getLabel(element)} secondary={element} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleOk} variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
};

ColumnSlushbucketDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  selectedColumns: PropTypes.array.isRequired,
};

export default ColumnSlushbucketDialog;
