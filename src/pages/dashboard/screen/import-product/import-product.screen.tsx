import { Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { requestImportApi } from '~/apis';
import CreateImportProduct from './import-product.create';
import ListImportProduct from './import-product.list';
import ImportProductView from './import-product.view';
import { useState } from 'react';
import { ImportProductMode } from './import-product.enum';
import { RequestImportPayload } from '~/apis/request-import/request-import.interface.api';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import DeliveryView from './delivery.view';
import ImportProductViewMissed from './import-product.view-missing';
import DeliveryViewMissed from './delivery.view-missed';

const ImportProductScreen: React.FC = () => {
  const { palette } = useTheme();

  const [mode, setMode] = useState<ImportProductMode>(ImportProductMode.LIST);
  const [importProduct, setImportProduct] = useState<RequestImportPayload | undefined>(undefined);

  const goList = () => {
    setImportProduct(undefined);
    setMode(ImportProductMode.LIST);
  };

  const goCreate = () => {
    setImportProduct(undefined);
    setMode(ImportProductMode.CREATE);
  };

  const goUpdate = (product: RequestImportPayload) => {
    setImportProduct(product);
    setMode(ImportProductMode.UPDATE);
  };

  const goView = (product: RequestImportPayload) => {
    setImportProduct(product);
    setMode(ImportProductMode.VIEW);
  };

  const goViewDelivery = (product: RequestImportPayload) => {
    setImportProduct(product);
    setMode(ImportProductMode.VIEW_DELIVERY);
  };

  const goViewMissed = (product: RequestImportPayload) => {
    setImportProduct(product);
    setMode(ImportProductMode.VIEW_MISSED);
  };

  const goViewDeliveryMissed = (product: RequestImportPayload) => {
    setImportProduct(product);
    setMode(ImportProductMode.VIEW_DELIVERY_MISSED);
  };

  const reloadItem = async (id?: number) => {
    if (!id) return;
    try {
      const res = await requestImportApi.getImportRequests();
      const found = res.find((r) => r.id === id);
      if (found) setImportProduct(found);
    } catch (err) {
      console.error('reloadItem failed', err);
    }
  };

  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý nhập hàng</Typography>
        {mode === ImportProductMode.LIST && (
          <Button onClick={goCreate}>
            <Typography variant="subtitle2">Thêm yêu cầu nhập hàng mới</Typography>
          </Button>
        )}
        {(mode === ImportProductMode.CREATE || mode === ImportProductMode.UPDATE) && (
          <Button onClick={goList}>
            <Typography variant="subtitle2">Quay Lại</Typography>
          </Button>
        )}
      </StackRowAlignCenter>
      <Divider sx={{ color: palette.divider }} />

      {mode === ImportProductMode.LIST && (
        <ListImportProduct
          onEdit={goUpdate}
          onView={goView}
          onViewDelivery={goViewDelivery}
          onViewMissed={goViewMissed}
          onViewDeliveryMissed={goViewDeliveryMissed}
        />
      )}
      {mode === ImportProductMode.VIEW && (
        <ImportProductView
          item={importProduct}
          onClose={goList}
          onEdit={(it) => {
            goUpdate(it);
          }}
          onReload={(id) => reloadItem(id)}
        />
      )}
      {mode === ImportProductMode.VIEW_DELIVERY && (
        <DeliveryView
          item={importProduct}
          onClose={goList}
          onEdit={(it) => {
            goUpdate(it);
          }}
          onReload={(id) => reloadItem(id)}
        />
      )}
      {mode === ImportProductMode.VIEW_MISSED && (
        <ImportProductViewMissed
          item={importProduct}
          onClose={goList}
          onEdit={(it) => {
            goUpdate(it);
          }}
          onReload={(id) => reloadItem(id)}
        />
      )}
      {mode === ImportProductMode.VIEW_DELIVERY_MISSED && (
        <DeliveryViewMissed
          item={importProduct}
          onClose={goList}
          onEdit={(it) => {
            goUpdate(it);
          }}
          onReload={(id) => reloadItem(id)}
        />
      )}
      {mode === ImportProductMode.CREATE && <CreateImportProduct onSuccess={goList} />}
      {mode === ImportProductMode.UPDATE && <CreateImportProduct onSuccess={goList} initial={importProduct} />}
    </Stack>
  );
};

export default ImportProductScreen;
