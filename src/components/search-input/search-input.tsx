import { FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { StackRow } from '../elements/styles/stack.style';
import { Search } from '@mui/icons-material';

export default function SearchInput() {
  return (
    <StackRow>
      {/* <TextField id="outlined-basic" label="Tìm kiếm" variant="outlined"  sx={{ width: '600px' }} />
      <Search/> */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: '660px' }}>
        <InputLabel htmlFor="outlined-adornment-weight">Tìm kiếm</InputLabel>
        <OutlinedInput
          id="outlined-adornment-weight"
          endAdornment={<Search sx={{ cursor: 'pointer' }} />}
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            'aria-label': 'weight',
          }}
          label="Tìm kiếm"
          
        />
      </FormControl>
    </StackRow>
  );
}
